<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Configuration;

use \RuntimeException;
use Symfony\Component\Yaml\Yaml;
use Claroline\CoreBundle\Library\Configuration\PlatformConfiguration;

/**
 * Service used for accessing or modifying the platform configuration parameters in prod/dev
 * environments. The service annotation cannot be used as the class is not the same in test
 * environment (see Library\Testing\PlatformTestConfigurationHandler).
 */
class PlatformConfigurationHandler
{
    private $configFile;
    private $parameters;
    private $defaultParameters = array(
        'name' => null,
        'support_email' => null,
        'footer' => null,
        'logo' => 'clarolineconnect.png',
        'allow_self_registration' => true,
        'locale_language' => 'fr',
        'theme' => 'claroline',
        'default_role' => 'ROLE_USER',
        'cookie_lifetime' => 0,
        'mailer_transport' => null,
        'mailer_host' => null,
        'mailer_username' => null,
        'mailer_password' => null,
        'mailer_auth_mode' => null,
        'mailer_encryption' => null,
        'mailer_port' => null,
        'terms_of_service' => true
    );

    public function __construct(array $configFiles)
    {
        $this->configFile = $configFiles['prod'];
        $this->parameters = $this->mergeParameters();
    }

    public function hasParameter($parameter)
    {
        if (array_key_exists($parameter, $this->parameters)) {
            return true;
        }

        return false;
    }

    public function getParameter($parameter)
    {
        $this->checkParameter($parameter);

        return $this->parameters[$parameter];
    }

    public function setParameter($parameter, $value)
    {
        if (!is_writable($this->configFile)) {
            $exception = new UnwritableException();
            $exception->setPath($this->configFile);

            throw $exception;
        }

        $this->checkParameter($parameter);
        $this->parameters[$parameter] = $value;
        $this->saveParameters();
    }

    public function setParameters(array $parameters)
    {
        foreach (array_keys($parameters) as $parameter) {
            $this->checkParameter($parameter);
        }

        $this->parameters = array_merge($this->parameters, $parameters);
        $this->saveParameters();
    }

    public function getPlatformConfig()
    {
        $config = new PlatformConfiguration();
        $config->setName($this->parameters['name']);
        $config->setSupportEmail($this->parameters['support_email']);
        $config->setFooter($this->parameters['footer']);
        $config->setSelfRegistration($this->parameters['allow_self_registration']);
        $config->setLocaleLanguage($this->parameters['locale_language']);
        $config->setTheme($this->parameters['theme']);
        $config->setDefaultRole($this->parameters['default_role']);
        $config->setTermsOfService($this->parameters['terms_of_service']);
        $config->setCookieLifetime($this->parameters['cookie_lifetime']);
        $config->setMailerAuthMode($this->parameters['mailer_auth_mode']);
        $config->setMailerEncryption($this->parameters['mailer_encryption']);
        $config->setMailerHost($this->parameters['mailer_host']);
        $config->setMailerPassword($this->parameters['mailer_password']);
        $config->setMailerUsername($this->parameters['mailer_username']);
        $config->setMailerPort($this->parameters['mailer_port']);
        $config->setMailerHost($this->parameters['mailer_host']);
        $config->setMailerTransport($this->parameters['mailer_transport']);

        return $config;
    }

    protected function mergeParameters()
    {
        if (!file_exists($this->configFile) && false === @touch($this->configFile)) {
            throw new \Exception(
                "Configuration file '{$this->configFile}' does not exits and cannot be created"
            );
        }

        $configParameters = Yaml::parse(file_get_contents($this->configFile)) ?: array();
        $parameters = $this->defaultParameters;

        foreach ($configParameters as $parameter => $value) {
            if (array_key_exists($parameter, $parameters)) {
                $parameters[$parameter] = $value;
            }
        }

        return $parameters;
    }

    protected function saveParameters()
    {
        file_put_contents($this->configFile, Yaml::dump($this->parameters));
    }

    protected function checkParameter($parameter)
    {
        if (!$this->hasParameter($parameter)) {
            throw new RuntimeException(
                "'{$parameter}' is not a parameter of the current platform configuration."
            );
        }
    }
}
